#!/bin/bash

podman run --rm -it \
  -p 3000:3000 \
  -p 3001:3001 \
  $(podman build -q .)
