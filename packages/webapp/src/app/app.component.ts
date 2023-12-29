import { Component, OnInit } from '@angular/core';
import { ChatRealyMessgae, SystemNotice, User } from '@websocket/types';
import { AppService } from './app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'websocket-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Welcome to Monorepo';
  messages: ChatRealyMessgae[] = [];
  users: User[] = [];
  currentUser: User;

  constructor(private appService: AppService, private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.appService.chatMessgae$.subscribe(
      (msg) => (this.messages = [...this.messages, msg])
    );
    this.appService.user$.subscribe((user) => (this.currentUser = user));
    this.appService.systemNotices$.subscribe((msg) => this.onSystemNotice(msg));
    this.appService.userList$.subscribe((users) => (this.users = users));
  }

  connect(usernameInput: HTMLInputElement) {
    const name = usernameInput.value;
    this.appService.connect(name);
  }

  send(chatInput: HTMLInputElement) {
    this.appService.send(chatInput.value);
    chatInput.value = '';
  }

  onSystemNotice(notice: SystemNotice) {
    this.snackbar.open(notice.contents, undefined, { duration: 5000 });
  }
}
