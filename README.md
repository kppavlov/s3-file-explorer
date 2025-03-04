# How to start the project

Just run `npm run dev` and the development server will start.

To build the project then `npm run build`.

To prettify `npm run prettier:write`.

# Datastructures

The datastructures picked to represent the FS is Tree. Unfortunately it is not a flat structure, so it has its own complications in terms of the React`s rendering efficiency.
I came up with a workaround so that it re-renders only the parts that really change.

# State management

I chose to use Zustand. It is a lightweight state management hooks library. It allows you to subscribe to changes to a specific property in the whole state
which minimizes the re-rendering when state changes where this could not be done with React`s context.

# Testing library

As I am using Vite for project scaffolding and building I installed the Vitest for the unit tests of the application.
The tests written cover only the most critical part of the app, the CRUD operations and a couple of other userflows.

# What is NOT implemented

1. I did not persist the S3 bucket`s secret as it is not secured in the browser, so this will not work.
2. I did not implement the lazy fetching of directories because of simplicity.




