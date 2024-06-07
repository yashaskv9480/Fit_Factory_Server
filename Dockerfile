    # Use the Node.js 20 image
    FROM  node:21.7.3-alpine3.20

    # Set the working directory in the container
    WORKDIR /usr/src/app

    # Copy package.json and package-lock.json files
    COPY package*.json ./

    # Install app dependencies
    RUN npm install

    ENV PORT=5000
    ENV TOKEN_SECRET=123
    ENV RAZORPAY_KEY_ID="rzp_test_IyFYaniRp47wLu"
    ENV RAZORPAY_KEY_SECRET=QNn1aNqRFyaijqR4LbBWIQAE
    ENV FIREBASE_CONFIG='{"type":"service_account","project_id":"image-demo-935e6","private_key_id":"ffa3fd9c0ccf0865748dfaee6e52c0b0dd52434e","private_key":"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCqqNUIKVZQRHxE\nLWhWccxAKX+q4I7wPZfZBmiC347iOHzOMNnufBjBe1q+r5lyFHxeNHN81K33t/kV\nvmm7Wkx6SJRbC+su6GIRIQs5zFOpLBge7FWm275MIOBQvhIK8DQuofJOVRKt68gB\n7TmZuxFPfyNYDdjrH6eZ+z4YLnrRAhFltyBIUNfQO8IXTMZnh4GeWftmDM+sLsu2\n5FBdLPtQ6HtC0XNRYFrCpycyB1PVy1QdpFquegCtpydjPaVGMH3bsqRxiFk9j65E\nXuUXxL9NV/7vP4z/Ru03q2aDtgQwnErHQg7lQjLH8NyuwUuUf4HwUU48mTdOY1we\nOQmFeC8rAgMBAAECggEATYzdCZFnRKBqa7zKngWmUD3LYwYaTjdfCmLsGRSn5ErR\nBA2U6td/lGSOrvoy23FNtq1VEZO/3kK+sM/PUjDNcgALUnhPDgjRj4EZjdE47zY3\nW83/egx/JC8IYAiPQGM5AzvaVRg5ncj4IVAAjchBLIPUts3MFcRTsBhIdkqgytrM\nvP/M5SJUX8FKsEUtvl4YTRwL+Zgk0cm7RmYNnOWmM1Y5rL5GZ7sHvKr46U2z8IEG\nyKY9C4J+c0rjzqauwaPY+DaxqqkpqPfK3Grp2e3CxSOMrfDu3GU0vtP+JjkewjIU\noSB7Y/+5ETQ/NDCZ0YEFpH6u3tEsAAQFQimRUpLb+QKBgQDTUkeNRcWJwZ+0vlSg\nKVFYrcC/HgxwBBymgUBbtySmOifhJejKdknGcD4GB5mr9UdpY5fdwmY7mhThz6VH\nI+Ix41JBLrznNE4CD+W1lPSCMgm/c+evsh7mvbKtu/Qn4QAI+7Kb+ivmmvWsvWJj\nX3tkwa+mXWhiaRLcHJ88GmLRXwKBgQDOvbyhZn0o9KTILbk8CbmqaY0Uczi3qfCp\nvitTor8glYhHxXPjnCk+/b3hyNCEapgxTatNoyS2itSdkexfrbQPgTzYDYjq55K8\nN7mB/eVAB7rIoMy4qXx/cLUNuZauv79obJcAGtiRicO/Y/vn58OxlJzUiGVNvxrM\nROaqGIQ5tQKBgGePWftUpwLkfZTA9Y3r0a6or925JxU6HqRGkTihHvfLZkHDJzsZ\nDvyNgwfHb7rCoDV4ljMaEqnAz9z9upyLbE1Qfr3s3qxbiKMgEU2UauLnDLnjXjZP\nDy+65TaY9oUYkcDVQGmKBzui}'
    ENV STORAGE_BUCKET="gs://image-demo-935e6.appspot.com"
    ENV DBConfigLink="postgres://kv:ZeP6UgWxF3uVmJijwiOSIcbYoMNme0BL@dpg-co9u1f20si5c739j44cg-a.oregon-postgres.render.com/fit_factory"

    # Copy the rest of the application code
    COPY . .

    # Expose the port the ap'p runs on
    EXPOSE 5000

    # Command to run the application
    CMD [ "npm", "start" ]
