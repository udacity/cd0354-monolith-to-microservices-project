#!/bin/bash

kubectl scale deploy backend-user --replicas=$1

kubectl scale deploy backend-feed --replicas=$1

kubectl scale deploy frontend --replicas=$1

kubectl scale deploy reverseproxy --replicas=$1
