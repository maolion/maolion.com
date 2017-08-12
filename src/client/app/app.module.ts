import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';

import { BlogView } from './pages/blog/blog.view';
import { HomeView } from './pages/home/home.view';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeView,
  },
  {
    path: 'blog',
    component: BlogView,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
  ],
  declarations: [
    AppComponent,
    HomeView,
    BlogView,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
