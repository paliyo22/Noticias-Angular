import { ChangeDetectionStrategy, Component, inject } from "@angular/core"
import { UserService } from "../../service/user.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { AuthService } from "../../service/auth.service"
import { NewsService } from "../../service/news.service"
import type { NewsOutput } from "../../schema/news"

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

  searchQuery = ""
  showPasswordForm = false
  adminPassword = ""
  passwordError = ""

  ngOnInit() {
    // Cargar datos iniciales
    this.loadInitialData()
  }

  private loadInitialData(): void {
    this.userService.getAll()
    this.newsService.getInactive()
  }

  // Método para buscar noticias
  searchNews(): void {
    if (this.searchQuery.trim()) {
      // TODO: Implementar búsqueda de noticias
      console.log("Buscando noticias con:", this.searchQuery)
    }
  }

  // Método para cargar noticias desde la API externa
  loadNews(): void {
    this.newsService.fetchApi()
  }

  // Método para mostrar el formulario de contraseña
  showCleanUsersForm(): void {
    this.showPasswordForm = true
    this.adminPassword = ""
    this.passwordError = ""
  }

  // Método para ocultar el formulario de contraseña
  hideCleanUsersForm(): void {
    this.showPasswordForm = false
    this.adminPassword = ""
    this.passwordError = ""
  }

  // Método para confirmar la limpieza de usuarios con contraseña
  confirmCleanUsers(): void {
    if (!this.adminPassword) {
      this.passwordError = "La contraseña es requerida"
      return
    }

    if (this.adminPassword.length < 6) {
      this.passwordError = "La contraseña debe tener al menos 6 caracteres"
      return
    }

    // TODO: Validar contraseña con el backend
    // Por ahora simulamos la validación
    if (this.adminPassword === "admin123") {
      this.cleanUsers()
      this.hideCleanUsersForm()
    } else {
      this.passwordError = "Contraseña incorrecta"
    }
  }

  // Método para limpiar usuarios inactivos
  private cleanUsers(): void {
    // TODO: Implementar limpieza de usuarios
    console.log("Limpiando usuarios inactivos...")
    // Aquí iría la lógica para eliminar usuarios inactivos
    // this.userService.cleanInactiveUsers()
  }

  // Método para limpiar noticias inactivas
  cleanNews(): void {
    this.newsService.clean()
  }

  // Método para restaurar una noticia inactiva
  restoreNews(newsId: string): void {
    this.newsService.changeStatus(newsId, false)
  }

  // Método para eliminar un usuario
  deleteUser(userId: string): void {
    // TODO: Implementar eliminación de usuario
    // Debería mostrar confirmación antes de eliminar
    console.log("Eliminando usuario:", userId)
  }

  // Método auxiliar para obtener la lista plana de noticias inactivas
  getInactiveNewsList(): NewsOutput[] {
    const inactiveData = this.newsService.state().inactive.data
    const allNews: NewsOutput[] = []

    for (const newsArray of inactiveData.values()) {
      allNews.push(...newsArray)
    }

    return allNews
  }

  // Método auxiliar para formatear fechas
  formatDate(timestamp: string | Date): string {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }
}
