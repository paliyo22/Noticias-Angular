import { ChangeDetectionStrategy, Component, effect, inject, signal } from "@angular/core"
import { UserService } from "../../service/user.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../service/auth.service"
import { NewsService } from "../../service/news.service"
import type { NewsOutput } from "../../schema/news"
import type { UserOutput } from "../../schema/user"
import { Router } from "@angular/router"

@Component({
  selector: "app-admin",
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin.component.html",
  styleUrl: "./admin.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminComponent {
  userService = inject(UserService)
  authService = inject(AuthService)
  newsService = inject(NewsService)
  route = inject(Router);

  isLogged = effect(() => {
    if(!this.authService.authState().logged){
      this.route.navigate(['/']);
    }
  })

  activeSection = signal<"search" | "inactive" | "users">("search")
  searchQuery = ""

  showPasswordForm = false
  showCleanUsersModal = false
  showCleanNewsModal = false
  adminPassword = ""
  passwordError = ""

  currentInactivePage = 1
  inactiveNewsPerPage = 10

  userSearchQuery = ""
  filteredUsers = signal<UserOutput[]>([])
  currentUserLimit = 10
  userIncrement = 10

  ngOnInit() {
    this.loadInitialData()
  }

  private loadInitialData(): void {
    this.userService.getAll()
    this.newsService.getInactive(this.inactiveNewsPerPage, 0)
    this.filteredUsers.set(this.userService.userState().allUsers.data)
  }

  setActiveSection(section: "search" | "inactive" | "users"): void {
    this.activeSection.set(section)
    if (section === "inactive") {
      this.loadInactiveNews()
    } else if (section === "users") {
      this.filterUsers()
    }
  }

  searchNews(): void {
    if (this.searchQuery.trim()) {
      this.newsService.search(this.searchQuery)
    }
    this.searchQuery = ""
  }

  deleteNews(newsId: string): void {
    this.newsService.changeStatus(newsId)
  }

  restoreNews(newsId: string): void {
    this.newsService.changeStatus(newsId)
  }

  loadInactiveNews(): void {
    const offset = (this.currentInactivePage - 1) * this.inactiveNewsPerPage
    this.newsService.getInactive(this.inactiveNewsPerPage, offset)
  }

  getInactiveNewsList(): NewsOutput[] {
    const inactiveData = this.newsService.state().inactive.data
    const allNews: NewsOutput[] = []
    for (const newsArray of inactiveData.values()) {
      allNews.push(...newsArray)
    }
    return allNews
  }

  getCurrentPageInactiveNews(): NewsOutput[] {
    const allNews = this.getInactiveNewsList()
    const startIndex = (this.currentInactivePage - 1) * this.inactiveNewsPerPage
    const endIndex = startIndex + this.inactiveNewsPerPage
    return allNews.slice(startIndex, endIndex)
  }

  getTotalInactivePages(): number {
    const total = this.newsService.state().inactive.total
    return Math.ceil(total / this.inactiveNewsPerPage)
  }

  nextInactivePage(): void {
    if (this.currentInactivePage < this.getTotalInactivePages()) {
      this.currentInactivePage++
      this.loadInactiveNews()
    }
  }

  previousInactivePage(): void {
    if (this.currentInactivePage > 1) {
      this.currentInactivePage--
      this.loadInactiveNews()
    }
  }

  filterUsers(): void {
    const allUsers = this.userService.userState().allUsers.data
    if (!this.userSearchQuery.trim()) {
      this.filteredUsers.set(allUsers)
    } else {
      const query = this.userSearchQuery.toLowerCase()
      const filtered = allUsers.filter(
        (user) => user.username.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
      )
      this.filteredUsers.set(filtered)
    }
    this.currentUserLimit = this.userIncrement
  }

  getFilteredUsers(): UserOutput[] {
    return this.filteredUsers()
  }

  getCurrentPageUsers(): UserOutput[] {
    return this.getFilteredUsers().slice(0, this.currentUserLimit)
  }

  hasMoreUsers(): boolean {
    return this.getFilteredUsers().length > this.currentUserLimit
  }

  loadMoreUsers(): void {
    this.currentUserLimit += this.userIncrement
  }

  deleteUser(userId: string): void {
    this.userService.delete(userId)
  }

  loadNews(): void {
    this.newsService.fetchApi()
  }

  showCleanUsersForm(): void {
    this.showPasswordForm = true
    this.showCleanUsersModal = true
    this.showCleanNewsModal = false
    this.adminPassword = ""
    this.passwordError = ""
  }

  showCleanNewsForm(): void {
    this.showPasswordForm = true
    this.showCleanNewsModal = true
    this.showCleanUsersModal = false
    this.adminPassword = ""
    this.passwordError = ""
  }

  hidePasswordForm(): void {
    this.showPasswordForm = false
    this.showCleanUsersModal = false
    this.showCleanNewsModal = false
    this.adminPassword = ""
    this.passwordError = ""
  }

  confirmCleanUsers(): void {
    if (!this.adminPassword) {
      this.passwordError = "La contraseña es requerida"
      return
    }
    if (this.adminPassword.length < 6) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres"
      return
    }
    this.userService.clean(this.adminPassword)
    this.hidePasswordForm()
  }

  confirmCleanNews(): void {
    if (!this.adminPassword) {
      this.passwordError = "La contraseña es requerida"
      return
    }
    if (this.adminPassword.length < 6) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres"
      return
    }
    this.newsService.clean(this.adminPassword)
    this.hidePasswordForm()
  }

}
