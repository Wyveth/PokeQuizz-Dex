import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Game } from 'src/app/api/models/concretes/game';
import { GameService } from 'src/app/api/services/game.service';
import { LocService } from 'src/app/api/services/loc.service';
import { AppResource } from 'src/app/app.resource';
import { BaseComponent } from 'src/app/shared/components/base/base.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  imports: [CommonModule],
})
export class GameComponent extends BaseComponent implements OnInit, OnDestroy {
  games!: Game[];
  gameSubscription!: Subscription;
  loc!: string;

  constructor(
    resources: AppResource,
    private gameService: GameService,
    private locService: LocService,
    private route: ActivatedRoute
  ) {
    super(resources);

    this.locService.loc$.subscribe((loc: string) => {
      this.loc = loc;
    });
  }

  ngOnInit() {
    this.gameSubscription = this.gameService
      .getGames()
      .subscribe((games: Game[]) => {
        this.games = games;
      });
  }

  ngOnDestroy(): void {
    if (this.gameSubscription) this.gameSubscription.unsubscribe();
  }
}
