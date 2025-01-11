import { Injectable } from "@angular/core";
import { ContactMessage } from "./contact.model";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  sendMessage(message: ContactMessage): Observable<boolean> {
    // Simulate API call
    console.log("Sending message:", message);
    return of(true).pipe(delay(1000));
  }
}
