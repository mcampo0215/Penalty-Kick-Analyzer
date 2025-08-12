import cv2
import mediapipe as mp
import sys
import os
import json

# Check if file exists
if len(sys.argv) < 2:
    sys.exit(1)

video_path = sys.argv[1]
if not os.path.exists(video_path):
    sys.exit(1)

# Mediapipe pose estimator
mp_pose = mp.solutions.pose
pose = mp_pose.Pose(static_image_mode=False)

cap = cv2.VideoCapture(video_path)
leaning_back_count = 0

data = []
while cap.isOpened():
    success, frame = cap.read()
    if not success:
        break

    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(frame_rgb)

    if result.pose_landmarks:
        landmarks = result.pose_landmarks.landmark
        data.append({
            "nose": (landmarks[mp_pose.PoseLandmark.NOSE].x, landmarks[mp_pose.PoseLandmark.NOSE].y),
            "left_foot": (landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX].x, landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX].y),
            "right_foot": (landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX].x, landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX].y),
            "left_hip": (landmarks[mp_pose.PoseLandmark.LEFT_HIP].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP].y),
            "right_hip": (landmarks[mp_pose.PoseLandmark.RIGHT_HIP].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP].y)
        })

cap.release()
pose.close()

print(json.dumps({"pose_data": data}))
