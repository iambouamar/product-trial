import { Component, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { ContactService } from "../../data-access/contact.service";
import { InputTextModule } from "primeng/inputtext";
import { InputTextareaModule } from "primeng/inputtextarea";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-contact-form",
  templateUrl: "./contact-form.component.html",
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    ToastModule,
    CommonModule,
  ],
  providers: [MessageService],
})
export class ContactFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(ContactService);
  private readonly messageService = inject(MessageService);

  public sending = false;

  public form: FormGroup = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    message: ["", [Validators.required, Validators.maxLength(300)]],
  });

  onSubmit() {
    if (this.form.invalid || this.sending) return;

    this.sending = true;
    this.contactService.sendMessage(this.form.value).subscribe({
      next: () => {
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Demande de contact envoyée avec succès",
        });
        this.form.reset();
      },
      error: () => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Une erreur est survenue",
        });
      },
      complete: () => {
        this.sending = false;
      },
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.form.get(fieldName);
    if (!control?.errors || !control.touched) return "";

    if (control.errors["required"]) return "Ce champ est requis";
    if (control.errors["email"]) return "Email invalide";
    if (control.errors["maxlength"])
      return "Message trop long (300 caractères maximum)";

    return "";
  }
}
