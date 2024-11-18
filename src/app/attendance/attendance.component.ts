import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.css']
})
export class AttendanceComponent {
  public capturedImages: WebcamImage[] = []; // Store up to 3 images
  private trigger: Subject<void> = new Subject<void>();
  public isRegistering: boolean = true; 
  public studentId: string = '';

  constructor(private http: HttpClient, private app: AppComponent) { }

  triggerSnapshot(): void {
    if (this.capturedImages.length < 3) {
      this.trigger.next();
    } else {
      alert('Maximum of 3 images can be captured.');
    }
  }

  public handleImage(webcamImage: WebcamImage): void {
    if (this.capturedImages.length < 3) {
      this.capturedImages.push(webcamImage);
    }
  }

  public handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
    alert('Webcam initialization failed. Please check your camera permissions.');
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public registerFace(): void {
    if (this.capturedImages.length > 0 && this.studentId) {
      const payload = {
        studentId: this.studentId,
        images: this.capturedImages.map(img => img.imageAsDataUrl.split(',')[1]) // Send all captured images
      };

      this.http.post(`${this.app.baseUrl}api/face/register`, payload).subscribe({
        next: (response) => {
          console.log('Student face registered successfully', response);
          alert('Student face registered successfully');
          this.capturedImages = [];
        },
        error: (err) => {
          console.error('Error registering face', err);
          alert('Error registering face');
        }
      });
    } else {
      alert('Please capture at least one image and provide a student ID.');
    }
  }

  public markAttendance(): void {
    if (this.capturedImages.length > 0 && this.studentId) {
      const payload = {
        studentId: this.studentId,
        images: this.capturedImages.map(img => img.imageAsDataUrl.split(',')[1])
      };

      this.http.post(`${this.app.baseUrl}api/face/verify`, payload).subscribe((response) => {
        if (response) {
          console.log(response);
          window.alert(response);
        } else {
          window.alert('Not found');
        }
      });
    } else {
      alert('Please capture at least one image and provide a student ID.');
    }
  }

  toggleRegistration(): void {
    this.isRegistering = !this.isRegistering;
    this.studentId = '';
    this.capturedImages = [];
  }
}
