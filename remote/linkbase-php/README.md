# linkbase-php

This is an example remote service written in PHP that provides the API which the frontend needs to in order to scrape the web and store backups remotely.

## Requirements

PHP 8.0 or higher is required.

### Extensions

These most likely must be enabled in your `php.ini` file.  
An example file can be found under the `config` directory.

- `curl`
- `mbstring`
- `openssl`
- `pdo_sqlite`
- `sqlite3`

### Dependencies

This project use [composer](https://getcomposer.org/) to manage packages

```bash
composer install
```

When using the portable version, use the `-d` option to specify the working directory

```bash
php composer.phar -d /path/to/dir install
```

## Hosting

It is possible to use the integrated php server to host this project

```bash
php -S localhost:8080 -c config -t src/routes 
```

## Notes

> [!IMPORTANT]
> Most browsers today block third party cookies by default. This means that the frontend will not be able to access the API if it is hosted on a different domain, for example localhost. To get around this, either disable the browser's cookie policy or host the frontend on the same domain as the API. For development purposes, it is recommended to disable the cookie policy.
