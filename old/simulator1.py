import os
import random
import string

from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

chrome_options = webdriver.ChromeOptions()
# if testing, open this option
# chrome_options.add_argument('--headless')
chrome_options.add_argument('window-size=1920x1080')
chrome_options.add_argument('--start-maximized')
driver = webdriver.Chrome(options=chrome_options)
flag = True

# stop loading in 3 seconds
driver.set_page_load_timeout(3)
try:
    # local pages address
    driver.get(
        "file:///Volumes/mac1/Selenium/ncadviser/www.ncadvertiser.com/index.html")
    print('finish loading ....')
except Exception:
    driver.execute_script('window.stop()')
    print("force stop loading")

# get height and width automatically, for screenshot full content
width = driver.execute_script("return document.documentElement.scrollWidth")
height = driver.execute_script("return document.documentElement.scrollHeight")
driver.set_window_size(width, height)


# generate random file name
def generate_random_str(randomlength):
    str_list = random.sample(string.digits + string.ascii_letters, randomlength)
    random_str = ''.join(str_list) + '.png'
    return random_str


# randomly click, if cannot click, click another one
def random_click(self):
    while True:
        i = random.randint(0, len(self))
        try:
            driver.set_page_load_timeout(2)
            self[i].click()
            print("load new page")
        except TimeoutException as t:
            print("load new page")
            return
        except Exception as e:
            print("this href cannot be opened, switch another one", i)


# get all href from the page
def get_all_href(self):
    ans = self.find_elements(By.XPATH, '//*[@href]')
    return ans


if __name__ == '__main__':
    href = get_all_href(driver)
    while flag:
        print('Please input action: ')
        action = input()
        if action[0:5] == 'click':
            location = action.split()
            print("click x:" + location[1] + " y:" + location[2])
            driver.set_page_load_timeout(2)
            try:
                ActionChains(driver).move_by_offset(location[1], location[2]).perform()
                ActionChains(driver).click().perform()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
            # driver.find_element(By.CLASS_NAME, "title-content-title").click()
        elif action[0:4] == 'move':
            location = action.split()
            print("x:" + location[1] + " y:" + location[2])
            ActionChains(driver).move_by_offset(location[1], location[2]).perform()
            print("move to x:" + location[1] + " y:" + location[2])
        elif action == 'screen':
            if not os.path.exists('screenshots'):
                os.mkdir('screenshots')
            fileName = generate_random_str(10)
            while os.path.exists('screenshots/' + fileName):
                fileName = generate_random_str(10)
            driver.get_screenshot_as_file('screenshots/' + fileName)
            print("screenshot named: " + fileName)
        elif action == 'random_click':
            driver.set_page_load_timeout(2)
            try:
                reload_href = random_click(href)
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")

        elif action == 'goto2':
            # testing
            driver.set_page_load_timeout(2)
            try:
                driver.find_element(By.XPATH, '//*[@id="topZone"]/div/div/div/ul/div[2]/li[1]/a').click()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
        elif action == 'goto3':
            # testing
            driver.set_page_load_timeout(2)
            try:
                driver.find_element(By.XPATH, '//*[@id="topZone"]/div/div/div/ul/div[2]/li[2]/a').click()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
        elif action == 'goto':
            print('What is your url?')
            url = input()
            driver.get(url)
        elif action == 'back':
            driver.set_page_load_timeout(1)
            try:
                driver.back()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
        elif action == 'find location':
            # testing
            location = driver.find_element(By.XPATH, '//*[@id="topZone"]/div/div/div/ul/div[2]/li[4]/a').location
            print(location)
        elif action == 'forward':
            driver.set_page_load_timeout(1)
            try:
                driver.forward()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
        elif action == 'refresh':
            driver.set_page_load_timeout(1)
            try:
                driver.refresh()
                print('finish loading ....')
            except Exception:
                driver.execute_script('window.stop()')
                print("force stop loading")
        elif action == 'type':
            print('What do you want to type?')
            word = input()
            driver.find_element(By.ID, "sb_form_q").send_keys(word)
            # driver.find_element(By.XPATH, '//*[@id="sb_form_q"]').send_keys(Keys.ENTER)
        elif action == 'close':
            flag = False
            driver.quit()
            print('bye')
            break
        else:
            print("Wrong action: " + action + " Try another!")

        href = get_all_href(driver)
        print("there are ", len(href), " hrefs in this page.")

    print('Progress over')

from pynput.mouse import Listener, Button

"""listening mouse """


# print mouse position
def on_move(x, y):
    print('鼠标指针移动到的位置 {0}'.format((x, y)))


#click the mouse


def on_click(x, y, button, pressed):
    if button == Button.left:
        print('{0}位置{1}'.format('鼠标左键按下' if pressed else '鼠标左键松开', (x, y)))
    elif button == Button.right:
        print('{0}位置{1}'.format('鼠标右键按下' if pressed else '鼠标右键松开', (x, y)))
    elif button == Button.middle:  # 停止监听
        return False


# scoll

def on_scroll(x, y, dx, dy):
    print('Scrolled {0}'.format((x, y)))
    print(dx, dy)


# Collect events until released
with Listener(on_move=on_move, on_click=on_click, on_scroll=on_scroll) as listener:
    listener.join()
