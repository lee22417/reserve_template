## Error Exception

```
throw new HttpException('Already existed id', HttpStatus.BAD_REQUEST);

< same >

throw new ForbiddenException({
statusCode: HttpStatus.BAD_REQUEST,
message: 'Already existed id',
});

```
