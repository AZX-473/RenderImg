import os

img_path = './img/'
img_list = os.listdir(img_path)
print('img_list: ', img_list)

with open('img.txt', 'w') as f:
    for img_name in img_list:
        f.write('"'+img_name+'",\n')