import time
import base64
import json

from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chromium.webdriver import ChromiumDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from webdriver_manager.chrome import ChromeDriverManager

# cd C:\Program Files\Google\Chrome\Application
# chrome.exe --remote-debugging-port=9222 --user-data-dir="D:\WVLN_Simulator\sim_com\profile"

# mac
# cd /Volumes/ddrive/WVLN/WVLN_Simulator/sim_com
# /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir="profile"

SIMULATOR_URL = 'http://localhost:4200/simcom'
# DEBUGGER_ADDRESS = 'localhost:9222'


def setup(port, url, force_reset_url=False):
    # initiating chrome web driver
    opt = Options()
    # port where chrome run in debugger mode
    opt.add_experimental_option("debuggerAddress", "localhost:" + str(port))
    # opt.headless = True

    # for windows
    # driver = webdriver.Chrome(service=Service("./chromedriver"), options=opt)  # driver initialisation
    # for mac m1
    driver = webdriver.Chrome(
        executable_path=ChromeDriverManager().install(), options=opt)

    # resize the window
    # driver.set_window_size(974, 1087)

    # navigating to the simulator
    if driver.current_url.strip() != SIMULATOR_URL:
        driver.get(SIMULATOR_URL)

    if force_reset_url:
        updateURL(driver, url)

    return driver


def updateURL(driver: ChromiumDriver, url: str):
    driver.execute_script(
        "document.getElementById('myframe').src = '{}'".format(url))


def switchToIframe(driver: ChromiumDriver):
    wait = WebDriverWait(driver, 10)
    wait.until(EC.frame_to_be_available_and_switch_to_it((By.ID, "myframe")))


def scrollTo(driver, x, y):
    last_height = 0
    new_height = driver.execute_script("return document.body.scrollHeight")

    # continuously scrolling until the point is reached
    while new_height != last_height:
        last_height = new_height
        driver.execute_script("window.scrollTo({}, {})".format(x, y))
        time.sleep(1)
        new_height = driver.execute_script("return document.body.scrollHeight")


def scrollToTheBottom(driver):
    scrollTo(driver, 0, 'document.body.scrollHeight')
    # to come back to the top
    scrollTo(driver, 0, 0)


def clickElement(driver, x, y, height=0, width=0):
    # scroll down to get the link to the viewport

    scroll_x = x - 812 + width
    if x > 812:
        scrollTo(driver, scroll_x, 0)
        x = x - scroll_x
    
    if y > 865:
        scrollTo(driver, scroll_x, y - 865 + height)
        y = y - (y - 865 + height)

    #
    # actions = ActionChains(driver)
    # actions.click
    # click
    driver.execute_script(
        "document.elementFromPoint({}, {}).click()".format(x, y))

    # to wait if the page inside frame navigates to another page
    driver.switch_to.default_content()
    switchToIframe(driver)


def getAllClickables(driver):
    elements = []

    elements_a = driver.find_elements(By.TAG_NAME, 'a')
    for element in elements_a:
        if element.is_displayed():  # excluding all the hidden links
            elemRect = element.rect
            clientRect = driver.execute_script("return arguments[0].getBoundingClientRect();", element)
            elements.append({'x': elemRect['x'], 'y': elemRect['y'], 'height': clientRect['height'], 'width': clientRect['width']})
        # print(element.rect, element.is_displayed(), element.text)

    return elements


def takeScreenshot(driver, save=False):
    # To save as a file directly from the browser
    # save_s = "var s=window.document.createElement('script');" \
    #      "s.type = 'text/javascript';" \
    #      "s.text=" \
    #      "" \
    #      "function saveAs(uri, filename) {" \
    #      "var link = document.createElement('a');" \
    #      "if (typeof link.download === 'string') {" \
    #      "link.href = uri;" \
    #      "link.download = filename;" \
    #      "document.body.appendChild(link);" \
    #      "link.click();" \
    #      "document.body.removeChild(link);" \
    #      "} else {" \
    #      "window.open(uri);" \
    #      "}" \
    #      "};" \
    #      "window.document.head.appendChild(s);"
    # driver.execute_script(save_s)

    # driver.execute_script("html2canvas(document.body, {useCORS: true, allowTaint: true})"
    #                       ".then(function(canvas) {"
    #                       "saveAs(canvas.toDataURL(), 'file-name.png');"
    #                       "});")

    # adding the html2canvas JS to the DOM

    # reading the JS file
    with open('html2canvas/html2canvas.js', 'r', encoding='utf-8') as dataFile:
        html2canvas = dataFile.read()

    driver.execute_script("var s=window.document.createElement('script');"
                          "s.type = 'text/javascript';"
                          # "s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js';"
                          "s.src=" + html2canvas + "; window.document.head.appendChild(s);")

    # taking the screenshot
    img_data: str = driver.execute_async_script("var result = arguments[0];"
                                                "html2canvas(document.body, {useCORS: true, allowTaint: true})"
                                                ".then(function(canvas) {"
                                                # "console.log(canvas.toDataURL());"
                                                "result(canvas.toDataURL('image/jpeg', 0.5));"
                                                "});")

    # removing the header of the returned code
    img_data = img_data.replace("data:image/jpeg;base64,", "")

    if save:
        with open("sh.jpeg", "wb") as fh:
            fh.write(base64.b64decode(img_data))

    return img_data


def performAction(url, bb, force_reset_url=False):
    driver = setup(port=9222, url=url, force_reset_url=force_reset_url)
    switchToIframe(driver)
    clickElement(driver, bb['x'], bb['y'], bb['height'], bb['width'])

    # to load the whole page
    scrollToTheBottom(driver)

    elements = getAllClickables(driver)
    img_data = takeScreenshot(driver, False)

    # data to return
    data = {
        'clickables': elements,
        'screenshot': img_data
    }

    return data


def screenShotsFromFile(fname):
    # may not implement

    # with open('data/' + fname + '.json', 'r') as f:
    #     data = json.load(f)

    #     for action in data['actions']:
    #         coords = {
    #             'x': float(action['x']) + float(action['x_offset']),
    #             'y': float(action['y']) + float(action['y_offset']),
    #             'height': action['height'],
    #             'width': action['width']
    #         }

    #         print(coords)
    #         performAction(coords)
            # break

    # print(data)
    pass


def playFromFile(name):
    with open('data_player/'+name+'.json', 'r') as f:
        data = json.load(f)
        url = data['url']
        actions = [{'x':action['x']+action['x_offset'], 'y':action['y']+action['y_offset'], 'height':action['height'], 'width':action['width']} for action in data['actions']]
        return url, actions


# example bounding box [y=y+y_offset]
# url, actions = playFromFile('R_1675220943_ES_6')
# data = performAction(url, actions[6])
# print(data)