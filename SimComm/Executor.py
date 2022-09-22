import time
import base64

from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC

from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chromium.webdriver import ChromiumDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait

# cd C:\Program Files\Google\Chrome\Application
# chrome.exe --remote-debugging-port=9222 --user-data-dir="D:\WVLN_Simulator\SimComm\profile"

SIMULATOR_URL = 'http://localhost:4200/'


def setup():
    # initiating chrome web driver
    opt = Options()
    opt.add_experimental_option("debuggerAddress", "localhost:9222")  # port where chrome run in debugger mode
    # opt.headless = True
    driver = webdriver.Chrome(service=Service("./chromedriver"), options=opt)  # driver initialisation

    # navigating to the simulator
    if driver.current_url.strip() != SIMULATOR_URL:
        driver.get(SIMULATOR_URL)

    return driver


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


def clickElement(driver, x, y):
    driver.execute_script("document.elementFromPoint({}, {}).click()".format(x + 10, y + 10))


def getAllClickables(driver):
    elements = []

    elements_a = driver.find_elements(By.TAG_NAME, 'a')
    for element in elements_a:
        if element.is_displayed():  # excluding all the hidden links
            elements.append(element.rect)
        # print(element.rect, element.is_displayed(), element.text)

    return elements


def take_screenshot(driver, save=False):
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
    driver.execute_script("var s=window.document.createElement('script');"
                          "s.type = 'text/javascript';"
                          "s.src='https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.js';"
                          "window.document.head.appendChild(s);")

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
        with open("x.jpeg", "wb") as fh:
            fh.write(base64.b64decode(img_data))

    return img_data


def performAction():
    driver = setup()
    switchToIframe(driver)
    clickElement(driver, 289, 551)

    elements = getAllClickables(driver)
    img_data = take_screenshot(driver, True)

    # data to return
    data = {
        'clickables': elements,
        'screenshot': img_data
    }

    return data


data = performAction()
# print(data)