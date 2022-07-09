#!/bin/env bash
FILENAME=".env"
if test -f "$FILENAME"; then
   rm $FILENAME
fi

touch $FILENAME

## need to use secret manager here so avoided adding env vars value
## Do contact the author for env variable values
## Or else you can find the values in the document shared by the auther
echo MONGODB_PASSWORD= >> $FILENAME
echo MONGODB_URI= >> $FILENAME
echo NODE_ENV= >> $FILENAME
echo CACHE_EXPIRATION_TIME_IN_SECONDS= >> $FILENAME
echo MAX_ENTRIES= >> $FILENAME
