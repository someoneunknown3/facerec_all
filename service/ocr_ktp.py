import base64
from .response import validation_response
from bson.json_util import dumps
import easyocr
from spellchecker import SpellChecker
import json
    
def ocr_ktp(collection, data_url):

    try:

        queries = []
        error_msg = []
        if len(data_url) == 0:
            error_msg.append("Photo is empty")

        if len(error_msg) > 0:
            raise Exception("Photo is empty")
        
        reader = easyocr.Reader(['id'])
        image_data = base64.b64decode(data_url.split(',')[1])

        result = reader.readtext(image_data)

        inserted_document = collection.find_one({"name": "dict_id"})
        json_str = json.loads(dumps(inserted_document))
        dict_id = json_str["value"]

        spell_constant = SpellChecker(language=None)
        spell_constant.word_frequency.load_words(dict_id)

        inserted_document = collection.find_one({"name": "dict_darah"})
        json_str = json.loads(dumps(inserted_document))
        dict_blood = json_str["value"]

        spell_blood = SpellChecker(language=None)
        spell_blood.word_frequency.load_words(dict_blood)

        inserted_document = collection.find_one({"name": "dict_provinsi"})
        json_str = json.loads(dumps(inserted_document))
        dict_province = json_str["value"]

        spell_province = SpellChecker(language=None)
        provinsi = [province['nama'] for province in dict_province]
        spell_province.word_frequency.load_words(provinsi)

        words = []
        locations = []

        sum_accuracy = 0
        len_accuracy = 0

        for elem in result:
            bbox = elem[0]
            locations.append(elem[0])
            parts = [part.strip() for part in elem[1].split(':')]
            words.extend(parts)

            sum_accuracy += elem[2]
            len_accuracy += 1

        avg_acccuracy = sum_accuracy / len_accuracy

        json_data = {
            "Accuracy": "%f%%" % (100 * avg_acccuracy),
            "Provinsi": "",
            "Kota/Kabupaten": "",
            "NIK": "",
            "Nama": "",
            "Tempat/Tgl Lahir": "", 
            "Gol. Darah": "", 
            "Alamat": "",
            "RT/RW": "",
            "Kel/Desa": "",
            "Kecamatan": "",
            "Agama": "",
            "Status Perkawinan": "",
            "Pekerjaan": "",
            "Kewarganegaraan": "",
            "Berlaku Hingga": ""
        }

        corrected_constants = []
        for i in range(len(words)):
            texts = words[i].split()
            constants = []
            for j in range(len(texts)):
                corrected_text = spell_constant.correction(texts[j])
                if corrected_text is not None:
                    corrected_text = corrected_text.strip()
                    constants.append(corrected_text)
                
            constant = ' '.join(constants)
            constant = ''.join([char for char in constant if char.isalpha() or char in [' ', '/', '.']])
            constant = constant.strip()
            if i < len(words):
                if constant.lower() == "provinsi" or constant.lower().startswith("provinsi"):
                    texts = words[i].split()
                    new_sentence = ' '.join(texts[1:])
                    corrected_text = spell_province.correction(new_sentence)
                    if corrected_text is not None:
                        json_data["Provinsi"] = corrected_text.upper()
                    else:
                        json_data["Provinsi"] = words[i].upper()
                elif i < len(words)/2 and (constant.lower() == "kota" or constant.lower().startswith("kota") or constant.lower() == "kabupaten" or constant.lower().startswith("kabupaten") or constant.lower() == "jakarta" or constant.lower().startswith("jakarta")):
                    spell_province = SpellChecker(language=None)
                    arr = [province['kota/kabupaten'] for province in dict_province if province['nama'] in [json_data["Provinsi"]]]
                    if len(arr) > 0:
                        kota_kabupaten = []
                        for element in arr[0]:
                            split_words = element.split()
                            kota_kabupaten.extend(split_words)
                        if len(kota_kabupaten) > 0:
                            spell_province.word_frequency.load_words(kota_kabupaten)
                            texts = words[i].split()
                            kota = ""
                            for j in range(len(texts)):
                                corrected_text = spell_province.correction(texts[j])
                                if corrected_text is not None: 
                                    if j > 0: 
                                        kota += " "
                                    kota += corrected_text
                            json_data["Kota/Kabupaten"] = kota.upper()
                    else:
                        json_data["Kota/Kabupaten"] = words[i].upper()
                elif constant.lower() == "tempat/tgl lahir" or (constant.lower().startswith("tempat") and constant.lower().endswith("lahir")):
                    json_data["Tempat/Tgl Lahir"] = words[i + 1].upper()
                match constant.lower():
                    case "nik":
                        json_data["NIK"] = words[i + 1].upper()
                    case "nama":
                        json_data["Nama"] = words[i + 1].upper()
                    case "gol darah":
                        corrected_text = spell_blood.correction(words[i + 1])
                        if corrected_text in dict_blood:
                            if corrected_text is not None:
                                corrected_text = next((word for word in dict_blood if word.lower() == corrected_text.lower()), corrected_text)
                                json_data["Gol. Darah"] = corrected_text.upper()
                        else:
                            json_data["Gol. Darah"] = "-"
                    case "alamat":
                        json_data["Alamat"] = words[i + 1].upper()
                    case "rt/rw":
                        json_data["RT/RW"] = words[i + 1].upper()
                    case "kel/desa":
                        json_data["Kel/Desa"] = words[i + 1].upper()
                    case "kecamatan":
                        json_data["Kecamatan"] = words[i + 1].upper()
                    case "agama":
                        json_data["Agama"] = words[i + 1].upper()
                    case "status perkawinan":
                        json_data["Status Perkawinan"] = words[i + 1].upper()
                    case "pekerjaan":
                        json_data["Pekerjaan"] = words[i + 1].upper()
                    case "kewarganegaraan":
                        json_data["Kewarganegaraan"] = words[i + 1].upper()
                    case "berlaku hingga":
                        json_data["Berlaku Hingga"] = words[i + 1].upper()
                    
            corrected_constants.append(constant)
        return validation_response("Read KTP Success", 200, data=json_data)
    except Exception as e:
        print(e)
        json_data = {
            "error": queries,
            "error_msg":error_msg
        }
        return validation_response("Read KTP failed", 400, data=json_data)


 