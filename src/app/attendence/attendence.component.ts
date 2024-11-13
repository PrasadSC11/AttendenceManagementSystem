import { Component } from '@angular/core';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendence.component.html',
  styleUrls: ['./attendence.component.css']
})
export class AttendanceComponent {
  public webcamImage: WebcamImage | null = null;
  private trigger: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) { }

  // Trigger the snapshot event
  triggerSnapshot(){
    console.log('Triggering snapshot');
    this.trigger.next();
  }

  // Handle captured image
  public handleImage(webcamImage: WebcamImage): void {
    console.log('Captured image:', webcamImage);
    this.webcamImage = webcamImage;
  }

  // Handle webcam initialization error
  public handleInitError(error: WebcamInitError): void {
    console.error('Webcam initialization error:', error);
    alert('Webcam initialization failed. Please check your camera permissions.');
  }

  // Observable for triggering the webcam capture
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  // Mark attendance by sending the captured image to the backend
  public markAttendance(): void {
    if (this.webcamImage) {
           
      const imageBlob = this.dataURItoBlob(this.webcamImage.imageAsDataUrl);
      console.log(imageBlob);
      const formData = new FormData();
      formData.append('image', imageBlob, 'attendance.jpg');
      console.log('Form Data:', formData);

      // Uncomment the API call when ready
      // this.http.post('/api/face/attendance', formData).subscribe({
      //   next: (response) => {
      //     console.log('Attendance marked successfully', response);
      //   },
      //   error: (err) => {
      //     console.error('Error marking attendance', err);
      //   },
      // });
    }

  }

  // Convert the captured image to a Blob format
  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const array = [];
    for (let i = 0; i < byteString.length; i++) {
      array.push(byteString.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mimeString });
  }
}

