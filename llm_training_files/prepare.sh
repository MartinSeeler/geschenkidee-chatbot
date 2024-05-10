# create a bash script to copy every "train_*"" file from the current directory into the train.jsonl file
#!/bin/bash

# create a new file
echo "" > train.jsonl

# loop through all files in the current directory
for file in train_*.json;
do
    # append the content of the file to the train.jsonl file
    cat $file >> train.jsonl
done