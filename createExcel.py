import pyexcel as pe
from datetime import datetime
import pyexcel.ext.xlsx
import os

import sys

#content = "1,2,3\n3,4,5"
#  a = []
#  sheet = pyexcel.get_sheet(array=a)
#  sheet.row += ["time/value", "co2", "light", "NH3", "temperature", "humidity", "voice"]
#sheet.format(int)
#print(sheet.to_array())
#sheet.save_as("data.xlsx")

def doCreate(path):
    #  a = []
    #  sheet = pyexcel.get_sheet(array=a)
    #  sheet.row += ["time/val", "co2", "light", "NH3", "temp", "humidity", "voice"]
    #  sheet.save_as(path)
    # 下面是新的创建方法2016.4.23

    array = ["time/val", "co2", "light", "NH3", "temp", "humidity", "voice"]
    sheet = pyexcel.Sheet(array)
    sheet.save_as(path)


def addExcel(path, nowtime):
    sheet = pe.get_sheet(file_name = path)
    
    oneRow = [nowtime]
    for i in range(1, len(sys.argv)):
        oneRow.append(sys.argv[i])
    sheet.row += oneRow
    sheet.save_as(path)


def createExcel():
    today = datetime.now()
    #print(today.strftime("%y-%m-%d"))
    #prefix = "/media/sdcard"
    prefix = "/f/"
    excelName = prefix + today.strftime("%y-%m-%d") + ".xlsx"
    nowtime = today.strftime("%X")
    print(excelName)
    if os.path.exists(excelName):
        print('i aleady exit')
    else:
        doCreate(excelName)
    addExcel(excelName, nowtime)
    
createExcel()

