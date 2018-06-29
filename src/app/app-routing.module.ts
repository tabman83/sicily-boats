import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CallbackComponent } from './callback/callback.component';
import { ContractComponent } from './contract/contract.component';

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'callback', component: CallbackComponent },
    { path: 'new', component: ContractComponent},
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
