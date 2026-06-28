from ultralytics import YOLO

def main():
    # Load pretrained YOLOv8 model
    model = YOLO("yolov8n.pt")

    # Train model
    model.train(
        data="data.yaml",   # dataset config
        epochs=50,          # increase for better accuracy (100+ recommended later)
        imgsz=640,          # image size
        batch=8,            # lower if your PC is slow
        device="cpu"        # change to "0" if you have GPU
    )

    # Save trained model
    model.export(format="onnx")

if __name__ == "__main__":
    main()