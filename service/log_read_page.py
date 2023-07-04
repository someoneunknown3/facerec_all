from .response import validation_response
from bson.json_util import dumps
import json
from pymongo import ASCENDING, DESCENDING
import math

def log_read_page(collection, page, limit, sort_by, direction):
    try:
        skip = (page - 1) * limit
        if direction == "DSC":
            sort_direction = DESCENDING
        elif direction == "ASC":
            sort_direction = ASCENDING
        else:
            raise Exception("direction either ASC or DSC")

        total_count = collection.count_documents({})
        total_pages = math.ceil(total_count / limit)

        projection = {"_id": 0}
        cursor = collection.find({}, projection).skip(skip).limit(limit).sort(sort_by, sort_direction)
        list_cur = list(cursor)
        data = json.loads(dumps(list_cur))
        json_data = {
            "current_page": page,
            "item_per_page": limit,
            "sort": direction,
            "sort_by": sort_by,
            "total_count": total_count,
            "total_page": total_pages,
            "item_this_page": len(data),
            "items": data
        }
        return validation_response("Success Get Log", 200, data=json_data)
    except Exception as e:
        print(e)
        return validation_response("Failed Get Log", 400)
    
# from .response import validation_response
# from bson.json_util import dumps
# import json

# def log_read_page(collection):
#     try:
#         cursor = collection.find()
#         list_cur = list(cursor)
#         json_data = json.loads(dumps(list_cur))
#         return validation_response("Success Get Log", 200, data=json_data)
#     except Exception as e:
#         print(e)
#         return validation_response("Failed Get Log", 400)