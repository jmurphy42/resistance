import { Component, OnInit, Input } from '@angular/core';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';

import { Game } from 'src/app/models/game';
import { Player } from 'src/app/models/player';
import { GameService } from 'src/app/services/game.service';
import { PlayerService } from 'src/app/services/player.service';
import { GamePhases } from 'src/app/enums/gamephases';
import { PhaseChangeStatuses } from 'src/app/enums/phaseChangeStatuses';
import { TEAM_SIZES } from 'src/app/constants';
import { Loyalty } from 'src/app/enums/loyalty';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  @Input() game: Game;
  @Input() playerId: string;
  @Input() player: Player;
  @Input() currentLeader: Player;
  @Input() previousPasses: number;
  @Input() previousFails: number;
  @Input() currentTeamPlayers: Player[];
  @Input() phaseChangeStatus: number;
  @Input() numNotVoted: number;

  gamePhases = GamePhases;
  phaseChangeStatuses = PhaseChangeStatuses;
  loyaltyEnum = Loyalty;
  TEAM_SIZES = TEAM_SIZES;
  faQuestionCircle = faQuestionCircle;
  numEvil: number;

  loyalty: string;
  displayLoyalty: boolean;
  displayLegend: boolean;

  fellowTraitors: Player[];


  constructor(
    private gameService: GameService,
    private playerService: PlayerService,
  ) { }

  ngOnInit() {
    this.playerService.getPlayer(this.game.roomCode, this.playerId).subscribe(player => {
      this.loyalty = player.loyalty ? 'Good' : 'Evil';
      this.displayLoyalty = true;
    });
    this.gameService.displayGameOver = true;
    this.fellowTraitors = [];
    this.game.players.forEach(player => {
      if (!player.loyalty && player._id !== this.playerId) {
        this.fellowTraitors.push(player);
      }
    });
    this.numEvil = Math.ceil(this.game.players.length / 3);
  }

  /** Ends Game */
  endGame(): void {
    this.gameService.displayGameOver = false;
    this.gameService.endGame();
  }

  toggleDisplayLoyalty() {
    this.displayLoyalty = !this.displayLoyalty;
  }

  getQuestResultBorderClass(roundNumber: number): any {
    let questResultBorderClass: any;
    if (roundNumber < this.game.currentRound) {
      if (this.game.missionResults[roundNumber]) {
        questResultBorderClass = { 'bg-success': true, 'text-white': true };
      } else {
        questResultBorderClass = { 'bg-danger': true, 'text-white': true };
      }
    } else if (roundNumber === this.game.currentRound) {
      questResultBorderClass = { 'border-dark': true, 'bg-light': true };
    } else {
      questResultBorderClass = { 'bg-light': true };
    }
    return questResultBorderClass;
  }

  getPlayerBorderClass(playerId: string): any {
    let playerBorderClass: any;

    if (this.game.phase !== this.gamePhases.Selection && this.game.currentTeam.includes(playerId)) {
      playerBorderClass = { 'bg-info': true, 'text-white': true};
    } else {
      playerBorderClass = { 'bg-light': true };
    }

    if (this.currentLeader._id === playerId) {
      playerBorderClass['border'] = true;
      playerBorderClass['border-dark'] = true;
    }
    return playerBorderClass;
  }
}
