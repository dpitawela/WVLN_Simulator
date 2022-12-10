import random
from selenium.webdriver.common.by import By
from SimulatorCommunicator import setup, switchToIframe, clickElement, scrollToTheBottom


def getAllClickables(driver):
    elements = []

    elements_a = driver.find_elements(By.TAG_NAME, 'a')
    for element in elements_a:
        if element.is_displayed() and element.is_enabled() and element.rect.__len__() != 0:  # excluding all the hidden links
            # print(element.get_property('attributes')[0].items(), "\n")

            data = {}
            data['x'] = element.rect['x']
            data['y'] = element.rect['y']
            data['width'] = element.rect['width']
            data['height'] = element.rect['height']
            data['outer_html'] = element.get_attribute('outerHTML')
            data['href'] = element.get_dom_attribute('href')
            data['href_full'] = element.get_attribute('href')

            elements.append(data)
            # break
    return elements


def collectData(n_data):
    driver = setup()
    switchToIframe(driver)

    for i in range(n_data):
        scrollToTheBottom(driver)
        clickables = getAllClickables(driver)
        chosenLink = random.choice(clickables[10:])
        print(chosenLink)

        clickElement(driver, chosenLink['x'], chosenLink['y'])
        break


collectData(5)
