import { ChangeDetectionStrategy, Component, HostListener, inject, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterLink, RouterLinkActive } from "@angular/router"

@Component({
  selector: "app-nav",
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: "./nav.component.html",
  styleUrl: "./nav.component.scss",
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavComponent {
  private router = inject(Router)

  isDropdownOpen = false
  searchQuery = ""

  toggleDropdown(event: Event): void {
    event.preventDefault() // Prevent default link behavior
    this.isDropdownOpen = !this.isDropdownOpen
  }

  closeDropdown(): void {
    this.isDropdownOpen = false
  }

  submitSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(["/search", this.searchQuery.trim()])
      this.searchQuery = "" // Clear the search input after submitting
    }
  }

  @HostListener("document:click", ["$event"])
  onClick(event: Event): void {
    const target = event.target as HTMLElement
    if (!target.closest(".dropdown") && this.isDropdownOpen) {
      this.closeDropdown()
    }
  }
}
