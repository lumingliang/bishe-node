import pyexcel
from datetime import datetime
import pyexcel.ext.xlsx
import os

#content = "1,2,3\n3,4,5"
#  a = []
#  sheet = pyexcel.get_sheet(array=a)
#  sheet.row += ["time/value", "co2", "light", "NH3", "temperature", "humidity", "voice"]
#sheet.format(int)
#print(sheet.to_array())
#sheet.save_as("data.xlsx")

def doCreate(path):
    a = []
    sheet = pyexcel.get_sheet(array=a)
    sheet.row += ["time/value", "co2", "light", "NH3", "temperature", "humidity", "voice"]
    sheet.save_as(path)

def createExcel():
    today = datetime.now()
    #print(today.strftime("%y-%m-%d"))
    #prefix = "/media/sdcard/edisonData/"
    prefix = ""
    excelName = prefix + today.strftime("%y-%m-%d") + ".xlsx"
    print(excelName)
    if os.path.exists(excelName):
        print('i aleady exit')
    else:
        doCreate(excelName)
    
createExcel()

