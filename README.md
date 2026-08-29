# Bitácora de Seguridad — Colinas del Portal

Registro comunitario de incidentes de seguridad para el barrio **Colinas del Portal**, Caucasia, Antioquia.

No es una app de denuncia. Es la herramienta que convierte hechos sueltos en **evidencia estadística** para sentarse con la Estación de Policía de Caucasia a exigir patrullaje, y con la Alcaldía a exigir alumbrado — con cifras, puntos y horas, no con quejas verbales.

---

## Qué hace

| Sección | Función |
|---|---|
| **Registrar** | Captura de un incidente en menos de un minuto: fecha/hora, modalidad, punto exacto, descripción, elementos hurtados, valor, circunstancias, radicado y GPS opcional. |
| **Bitácora** | Historial completo con búsqueda por texto, filtro por modalidad y filtro por estado de denuncia. Cada registro lleva sello visible: *Radicado* (verde) o *Sin denuncia* (ámbar). |
| **Análisis** | Indicadores, **rejilla de calor 7×24** ("el reloj del barrio"), franja crítica redactada en lenguaje llano, ranking de puntos críticos y de modalidades. |
| **Informe** | Documento imprimible/PDF dirigido a la Policía Nacional: resumen, puntos de concentración, distribución horaria, relación detallada y petición formal, con espacio de firma. |
| **Ajustes** | Rol administrador, respaldo JSON/CSV, restauración y aviso de tratamiento de datos. |

### El elemento central: la rejilla 7×24
Cada casilla es una hora de un día de la semana; se entinta según la cantidad de hechos. Con 15+ registros el patrón se vuelve visible y la app redacta sola la conclusión:

> *El 62% de los hechos ocurre en la franja de la noche (6 p. m. – 12 a. m.), y el día más golpeado es el Viernes.*

Esa frase es exactamente lo que se lleva a la mesa con la Policía.

---

## Habeas Data — Ley 1581 de 2012

- Nombre y teléfono del reportante son **opcionales**.
- Si se diligencian, exigen **casilla de autorización** marcada.
- En modo vecino se muestran **enmascarados**: `Harold Marín` → `H. M.`, `3117700431` → `311•••••431`.
- Solo el rol **administrador** ve los datos completos, exporta CSV con contacto e incluye contactos en el informe.
- El informe sin datos sensibles lleva la reserva legal explícita.
- Aviso de tratamiento de datos permanente en la sección Ajustes.

**Regla de la bitácora, escrita dentro de la app:** no se publican fotos ni nombres de sospechosos, no se convoca a justicia por mano propia, no se organiza gente armada.

---

## Despliegue en GitHub Pages

```bash
git init
git add index.html README.md
git commit -m "Bitácora de Seguridad Colinas del Portal v1.0"
git branch -M main
git remote add origin https://github.com/haroldco45/bitacora-seguridad-colinas.git
git push -u origin main
```

Luego: **Settings → Pages → Source: Deploy from a branch → main / (root)**.

Queda en: `https://haroldco45.github.io/bitacora-seguridad-colinas/`

### Pendientes al subir

1. **`og-image.png`** en la raíz, 1200×630 px. Sin ella la vista previa en WhatsApp sale en blanco.
2. **`sw.js`** en la raíz para que funcione sin datos (el `index.html` ya lo registra):

```js
const CACHE = 'bitacora-colinas-v1';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
```

3. Si cambias el nombre del repositorio, actualiza las tres URLs de `og:image` / `og:url` / `twitter:image` en el `<head>`.

---

## Datos y respaldo

Todo se guarda en el **almacenamiento local del dispositivo**. No hay servidor, no hay base de datos, no viaja nada a internet. Consecuencias:

- Cada celular tiene su propia bitácora. **Designa un solo teléfono como el oficial del comité.**
- Si se borran los datos del navegador o se formatea el equipo, se pierde todo.
- **Descargar el respaldo JSON cada semana** desde Ajustes. La restauración fusiona sin duplicar (compara por `id`).

Clave de administrador por defecto: **`1234`**. Cámbiala en el primer uso. Es protección de conveniencia frente a un vecino curioso, no cifrado; el respaldo descargado sí contiene los datos en claro, guárdalo con cuidado y no lo reenvíes por grupos de WhatsApp.

---

## Cómo usarla bien

1. **Un solo teléfono oficial.** El resto de vecinos reporta al grupo y el encargado registra.
2. **Registrar todo**, incluso lo que no se denunció. Ese porcentaje de "sin denuncia" es el argumento para presionar que se denuncie.
3. **Punto exacto siempre**, con referencia física ("frente a la tienda de doña Rosa"). Los puntos escritos igual se agrupan solos.
4. A los **60–90 días**, generar el informe y pedir la reunión con la Estación.
5. Solo entonces decidir dónde van luminarias y cámaras. Antes de tener los datos, esa plata se gasta en el poste equivocado.

---

## Técnico

HTML/CSS/JS puro en un solo archivo. Sin dependencias, sin build, sin API. Tipografías Archivo + IBM Plex Sans/Mono vía Google Fonts. PWA instalable con manifiesto e íconos generados en tiempo de ejecución (canvas). Hora fijada a **UTC-5 (Colombia)** en todos los cálculos. Accesible por teclado, foco visible, `prefers-reduced-motion` respetado, responsive desde 320 px. Estilos de impresión dedicados para el informe.

---

**Desarrollada por Vibras Positivas HM — Derechos de Autor Reservados**
