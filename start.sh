#!/bin/bash

set -ex

chmod +x wait-for-it.sh

./wait-for-it.sh db:3306

npx prisma migrate reset --force 

exec npm run dev 
