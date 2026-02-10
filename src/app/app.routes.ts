import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { NewsComponent } from './component/news/news.component';
import { CategoryNewsComponent } from './component/category-news/category-news.component';
import { NotFoundComponent } from './component/not-found/not-found.component';
import { SignUpComponent } from './component/sign-up/sign-up.component';
import { UserComponent } from './component/user/user.component';
import { loggedGuard } from './guard/logged.guard';
import { SearchComponent } from './component/search/search.component';

export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'news/:id', component: NewsComponent},
    {path: 'category/:category', component: CategoryNewsComponent},
    {path: 'sign-up', component: SignUpComponent, canActivate: [loggedGuard(false)]},
    {path: 'user', component: UserComponent, canActivate: [loggedGuard(true)]},
    {path: 'search/:content', component: SearchComponent},
    {path: '**', component: NotFoundComponent}
];
