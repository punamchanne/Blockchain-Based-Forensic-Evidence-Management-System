import sys
import os
import face_recognition
import json
import numpy as np

def get_embedding(image_path):
    try:
        if not os.path.exists(image_path):
            return {"success": False, "error": f"File not found: {image_path}"}

        # Load the image
        image = face_recognition.load_image_file(image_path)
        
        # Detect face and get encodings
        face_encodings = face_recognition.face_encodings(image)
        
        if len(face_encodings) == 0:
            return {"success": False, "error": "No face detected in the image"}

        # Return the first face encoding as a list
        encoding_list = face_encodings[0].tolist()
        return {"success": True, "embedding": encoding_list}

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "Insufficient arguments"}))
        sys.exit(1)

    img_path = sys.argv[1]
    result = get_embedding(img_path)
    print(json.dumps(result))
