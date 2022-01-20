import { Controller, Get, Request, Response, Query, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { TransactionsService } from './transactions/transactions.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService,
              private transactionsService: TransactionsService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('auth/signup')
  async signup(@Request() req, @Response() res) {
    try
    {
      await this.authService.create(req.body.name, req.body.email, req.body.password, req.body.passwordConfirmation);
      res.status(201).send();
    }
    catch(ex) {
      console.error(ex);
      res.status(400).send({error: ex.message});
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {user: req.user, balance: await this.transactionsService.getBalance(req.user.email) };
  }

  @UseGuards(JwtAuthGuard)
  @Get('transactions')
  async getTransactions(@Request() req, @Query() query) {
    return await this.transactionsService.findByUserLimit(req.user.email, query.count, query.page);
  }

  @UseGuards(JwtAuthGuard)
  @Post('transaction/send')
  async send(@Request() req, @Response() res) {
    try
    {
      let transaction = await this.transactionsService.create(req.user.email, req.body.recepient, req.body.amount);
      res.status(201).send(transaction);
    }
    catch(ex) {
      console.error(ex);
      res.status(400).send({error: ex.message});
    }
  }
}