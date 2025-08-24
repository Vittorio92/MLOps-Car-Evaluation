import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CarEvaluationPageComponent } from './components/car-evaluation-page/car-evaluation-page.component';
import { DatasetManagementPageComponent } from './components/dataset-management-page/dataset-management-page.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'car-evaluation', pathMatch: 'full' },
  { path: 'car-evaluation', component: CarEvaluationPageComponent },
  { path: 'dataset', component: DatasetManagementPageComponent, canActivate: [AuthGuard] },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'car-evaluation' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
