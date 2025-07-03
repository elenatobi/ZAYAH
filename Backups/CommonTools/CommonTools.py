import random

vocabulary_list = []

f = open("Vocabulary.txt", "r")
lines = f.readlines()
f.close()

for line in lines:
    vocabulary_list.append(line.strip("\n").split(":"))


correct_words = 0
incorrect_list = []

random.shuffle(vocabulary_list)
for question, answer in vocabulary_list:
    print(question)
    user_input = input("->")
    if user_input == answer:
        print("Correct!")
        correct_words += 1
    else:
        incorrect_list.append([question, answer])
        print("Incorrect!", answer)
   
print(f"Correct words: {correct_words} of {len(vocabulary_list)}")

f = open("Vocabulary.txt", "w")
for item in incorrect_list:
    f.write(":".join(item) + "\n")

f.close()