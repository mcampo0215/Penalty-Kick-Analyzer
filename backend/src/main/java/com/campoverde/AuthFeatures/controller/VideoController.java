package com.campoverde.AuthFeatures.controller;

import com.campoverde.AuthFeatures.service.LLMService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/api/video")
public class VideoController {
    @Autowired
    private LLMService llmService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadVideo(@RequestParam("file") MultipartFile file) throws IOException {
        Path path = Paths.get("uploads/" + file.getOriginalFilename());
        Files.createDirectories(path.getParent());
        Files.write(path, file.getBytes());

        return ResponseEntity.ok("Video uploaded successfully.");

    }

    @PostMapping("/analyze")
    public ResponseEntity<String> analyzeVideo(@RequestParam("file") MultipartFile file) {
        try {
            String fileName = file.getOriginalFilename();
            Path path = Paths.get("uploads/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());

            ProcessBuilder processBuilder = new ProcessBuilder(
                    "/Users/matthewcampoverde/PycharmProjects/VideoAnalysis/.venv/bin/python", "analyzePos.py", path.toAbsolutePath().toString()
            );
            processBuilder.directory(new File("/Users/matthewcampoverde/PycharmProjects/VideoAnalysis/"));
            processBuilder.redirectErrorStream(false);
            Process process = processBuilder.start();

            BufferedReader stdOut = new BufferedReader(new InputStreamReader(process.getInputStream()));

            StringBuilder output = new StringBuilder();
            String line;
            while ((line = stdOut.readLine()) != null) {
                output.append(line).append("\n");
            }

            process.waitFor();

            String jsonOutput = output.toString().trim();
            int jsonStart = jsonOutput.indexOf("{");
            int jsonEnd = jsonOutput.lastIndexOf("}") + 1;


            if (jsonStart == -1 || jsonEnd == -1) {
                return ResponseEntity.status(500).body("Video Analysis Failed\n" + output.toString());

            }
            String cleanJson = jsonOutput.substring(jsonStart, jsonEnd);
            String feedback = llmService.generateFeedback(cleanJson);
            return ResponseEntity.ok(feedback);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Server error: " + e.getMessage());
        }
    }
}
