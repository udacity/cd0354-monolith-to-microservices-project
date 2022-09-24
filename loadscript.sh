#!/bin/bash

while true; do
	curl --location --request GET 'http://ae50397216cab434dab53352e0b57eed-324969250.us-east-1.elb.amazonaws.com:8080/health'
done
