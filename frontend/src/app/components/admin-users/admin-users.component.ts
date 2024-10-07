import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  idUser: number;
  username: string;
  email: string;
  role: string;
  isVerified: boolean;
}

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  pagedUsers: User[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalPages: number = 0;
  errorMsg: string = '';
  roles: string[] = ['role-user', 'role-admin'];

  constructor(private userService: UsersService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.pageSize);
        this.setPage(1);
      },
      (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.errorMsg = 'Erreur lors du chargement des utilisateurs.';
      }
    );
  }

  setPage(page: number) {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.pagedUsers = this.users.slice(startIndex, startIndex + this.pageSize);
  }

  getUserRole(user: User): string {
    const role = this.userService.parseRoles(user.role);
    return role.includes('role-admin') ? 'role-admin' : 'role-user';
  }

  isAdmin(user: User): boolean {
    return this.userService.isAdmin(user);
  }

  updateUserRole(user: User, newRole: string): void {
    if (confirm('Êtes-vous sûr de vouloir changer le rôle de l\'utilisateur ?')) {
      let newRoles = ['role-user'];
      if (newRole === 'role-admin') {
        newRoles.push('role-admin');
      }
      newRole = JSON.stringify(newRoles)
  
      this.userService.updateUserRole(user.idUser, newRole).subscribe({
        next: (response: any) => {
          if (response && response.userUpdated) {
            user.role = response.userUpdated.role;
          } else {
            console.warn('Réponse inattendue de l\'API:', response);
          }
        },
        error: (errorMessage: string) => {
          console.error('Erreur lors de la mise à jour du rôle:', errorMessage);
          this.errorMsg = errorMessage;
          setTimeout(() => {
            this.getUserRole(user);
          });
        }
      });
    }
  }
}
