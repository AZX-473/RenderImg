import os

img_path = './img/'
img_list = os.listdir(img_path)
print('img_list: ', img_list)

with open('img.txt', 'w') as f:
    for img_name in img_list:
        f.write('"'+img_name+'",\n')


def add_quotes_to_each_line(input_filepath, output_filepath):
    try:
        with open(input_filepath, 'r', encoding='utf-8') as infile, \
             open(output_filepath, 'w', encoding='utf-8') as outfile:

            for line in infile:
                modified_line = f'"{line.strip()}",\n'
                outfile.write(modified_line)
        print(f"处理完成，结果已保存到: {output_filepath}")
    except FileNotFoundError:
        print(f"错误：文件 '{input_filepath}' 未找到。")
    except Exception as e:
        print(f"发生错误: {e}")

add_quotes_to_each_line('url.txt', 'newurl.txt')