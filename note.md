## Error Exception

```
https://docs.nestjs.com/exception-filters#exception-filters

throw new HttpException('Already existed id', HttpStatus.BAD_REQUEST);

throw new HttpException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Already existed id',
});

throw new ForbiddenException({
    statusCode: HttpStatus.BAD_REQUEST,
    message: 'Already existed id',
});

```
