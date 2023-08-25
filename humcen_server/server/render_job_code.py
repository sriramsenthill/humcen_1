from job_num_generator import generate_next_job_number
import sys

def render_new_job_numbers(jobs):
    num = 1000
    charID = "A-0000"
    new_dict = {}
    requested_ids = []
    for jobIDs in range(1000, int(max(jobs)+1)):
        new_dict[jobIDs] = generate_next_job_number(charID)
        charID = new_dict[jobIDs]
    for job in jobs:
        requested_ids.append(new_dict[job])
    return requested_ids

newList = [int(i) for i in sys.argv[1].split(',')]
print(render_new_job_numbers(newList))

