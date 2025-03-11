# ¿Qué es una API REST?

Un servicio web que utiliza URLs para identificar recursos y formatos como JSON o XML para intercambiar datos.

> Una definición mas humana seria como un proveedor o intermediario de datos.
>

## ¿Quienes se conectan a una API?

Computadoras, celulares, personas, aplicaciones, otras APIS.

![API Integration: Types & Benefits | BotPenguin](https://cdn.botpenguin.com/assets/website/API_Integration_8cb6b3f49e.webp)

![What is an API Integration? (A guide for non-technical people)](https://www.gend.co/hs-fs/hubfs/Workato%20Onboarding.png?width=1698&name=Workato%20Onboarding.png)

## Ejemplo de un Recurso

***Una API consta de 1 0 más recursos y cada recurso debe ser único.***

Eventos de Google Calendario

```sh
/google-calendar/eventos
```

Correos de Gmail

```
/gmail/bandeja
```

Correos enviados de Gmail

```
/gmail/enviados
```

## ¿Qué es JSON?

Es un formato ligero para intercambiar datos, fácil de leer y escribir para humanos y máquinas.

```json
{
  "eventos": [
    {
      "id": 1,
      "nombre": "Cumpleaños de Ana"
    },
    {
      "id": 2,
      "nombre": "Cumpleaños de Juan"
    },
    {
      "id": 3,
      "nombre": "Cumpleaños de María"
    }
  ]
}
```

