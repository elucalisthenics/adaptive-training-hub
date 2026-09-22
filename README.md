# Adaptive Training Hub

We are building a personal browser-based adaptive calisthenics training application.

IMPORTANT: Do not build the full application yet.

For this step, create only the technical and visual foundation.

PROJECT PRINCIPLES

The application is a serious personal training tool, not a commercial fitness product.

The future core of the application will be a deterministic adaptive training engine that uses workout history, skill progression, weak points, equipment availability, environment and recovery data.

Do not implement that training engine yet.

TECHNICAL REQUIREMENTS

Use TypeScript.

Use the connected Supabase project as the backend.

Keep the code modular and easy to maintain.

Do not hard-code workout logic inside UI components.

Prepare the project for a separate domain/training-engine layer later.

Do not add external AI APIs.

Do not add payments.

Do not add social features.

Do not add gamification.

Do not create a large exercise database yet.

CREATE THE FOLLOWING APPLICATION SHELL

Mobile-first responsive layout with these navigation destinations:

Today

Program

Skills

Progress

Weak Points

Settings

TODAY PAGE

Create a placeholder dashboard containing:

Today's workout type

Estimated workout duration

Primary focus

A placeholder list of workout exercises

Start Workout button

Use mock content only for now.

Example:

PULL HEAVY
Estimated: 70 min

Focus:
Muscle-up
Front Lever

Example workout cards may show:

High Pull-up
5 × 3
RIR 2
Rest 2:30

Do not implement workout-generation logic yet.

DESIGN DIRECTION

Dark mode as default

Clean

Minimal

Athletic

Serious rather than playful

Mobile-first

Large touch targets

High readability outdoors

Avoid excessive gradients

Avoid game-like badges

Avoid stock fitness imagery

Make data and workout information the visual focus

ARCHITECTURE

Create a project structure conceptually separating:

UI / pages

reusable components

domain logic

data access

types

Create an empty or placeholder domain area for future modules such as:

training-engine

progression

substitutions

weak-points

coverage

readiness

Do not implement those algorithms yet.

SUPABASE

Verify that the connected Supabase backend is accessible.

Do not create the full database schema yet.

If a minimal profile/auth structure is required by the framework, keep it minimal and explain exactly what was created.

OUTPUT

After implementing this step, summarize:

What files/components were created.

What Supabase changes were made.

What remains mock data.

Any architecture decisions you made.

Any issues or assumptions.

Do not proceed beyond this scope.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1913739d-98ae-45b9-a1a4-8f0939bb09d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
