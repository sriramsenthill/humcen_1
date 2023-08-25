import sys

import sys

def create_new_character(string_part):
    new_char = True
    # Checking for addition of letter in string part
    for i in string_part:
        if i != "Z":
            new_char = False

    # Logic to add Character in the String Part
    if new_char:
        new_num = "A"
        for i in string_part:
            new_num += chr(65)
        num_part = "-0001"
        job_number = new_num + num_part
        return (job_number)

def string_part_formation(string_part, number_part , length):
    if number_part >= 9999:
        if string_part[-(length - 1):] == "Z" * (length - 1) and string_part[:-(length)] == "":
            new_num = ""
            if string_part[-(length)] != '' and ord(string_part[-(length)]) < 90:
                new_num += chr(ord(string_part[-(length)]) + 1) + "A" * (length - 1)
                num_part = "-0001"
                job_number = str(new_num + num_part)

                return job_number
            else:
               return create_new_character(string_part)

        elif string_part[:-(length)] == "":

            if string_part[-1] == "Z":
                new_num = "".join(string_part[-(length)])
                new_num += chr(ord(string_part[-(length - 1)]) + 1) + "A"
                num_part = "-0001"
                job_number = str(new_num + num_part)

                return job_number
            else:
                new_num = "".join(string_part[:-1])
                new_num += chr(ord(string_part[-1]) + 1)
                num_part = "-0001"
                job_number = str(new_num + num_part)

                return job_number

    else:
        job_number = string_part + "-" + str(number_part + 1).zfill(4)

        return job_number


def generate_next_job_number(previous_job):
    string_part = previous_job.split("-")[0]
    number_part = int(previous_job.split("-")[1])

    # Logic to change the 2nd to Last Digit
    if(len(string_part) > 1):
       return string_part_formation(string_part, number_part, len(string_part))

    else:
        if string_part == "Z" and number_part >= 9999:
            new_num = "AA-0001"
            return new_num
        elif string_part != "Z" and number_part >= 9999:
            new_num = "".join(chr(ord(string_part) + 1))+"-0001"
            return new_num
        elif number_part < 9999 and string_part != "Z":
            new_num = string_part + "-" + str(number_part + 1).zfill(4)
            return new_num
        elif string_part == "Z" and number_part < 9999:
            new_num = string_part + "-" + str(number_part + 1).zfill(4)
            return new_num



if __name__ == '__main__':
    prevJobNo = sys.argv[1]
    nextJobNo = generate_next_job_number(prevJobNo)
    print(nextJobNo)