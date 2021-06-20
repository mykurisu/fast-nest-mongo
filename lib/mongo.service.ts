import { MongoClient, MongoError } from 'mongodb';
import { Inject, Injectable, OnModuleInit, HttpException, HttpStatus } from '@nestjs/common';
import { MyLogger } from '@mykurisu/fast-nest-logger';
import { CONFIG_OPTIONS } from './mongo.constants';
import { MongoModuleOptions } from './interface';


@Injectable()
export class MongoService implements OnModuleInit {
    public connection: MongoClient | null = null

    constructor(
        @Inject(CONFIG_OPTIONS)
        private readonly options: MongoModuleOptions,
        private readonly myLogger: MyLogger
    ) {}

    async onModuleInit() {
        if (!this.options.url) {
            this.myLogger.error('MongoDB URL NOT FOUND', '', 'MongoService')
            return
        }
        await this.DBInit()
    }

    async getDB(db: string) {
        if (!this.connection) {
            throw new HttpException('DB ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return this.connection.db(db)
    }

    async getCol(collection: string, db?: string) {
        if (!this.connection) {
            throw new HttpException('DB ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        if (!db) {
            db = this.options.appDbName
        }
        const database = this.connection.db(db)
        if (!database) {
            throw new HttpException('DB ERROR', HttpStatus.INTERNAL_SERVER_ERROR)
        }
        return database.collection(collection)
    }

    private DBInit() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(this.options.url, {
                poolSize: this.options.poolSize,
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, (err: MongoError, client: MongoClient | null) => {
                if (err) {
                    this.myLogger.error('MongoDB INIT FAIL', JSON.stringify(err), 'MongoService')
                    reject(err)
                }
                this.connection = client
                this.myLogger.log('MongoDB INITED', 'MongoService')
                resolve('MongoDB INITED');
            })
        })
    }

}
