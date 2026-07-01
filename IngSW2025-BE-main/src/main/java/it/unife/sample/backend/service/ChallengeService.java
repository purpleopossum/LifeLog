package it.unife.sample.backend.service;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import it.unife.sample.backend.model.Challenge;
import it.unife.sample.backend.model.Milestone;
import it.unife.sample.backend.model.User;
import it.unife.sample.backend.repository.ChallengeRepository;
import it.unife.sample.backend.repository.MilestoneRepository;
import it.unife.sample.backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private UserRepository userRepository;


    public List<Challenge> getUserChallenges(UUID userId) {
        return challengeRepository.findAllByUserIdWithMilestones(userId);
    }

    @Transactional
    public Milestone toggleMilestoneCheck(Long milestoneId, UUID userId) {
        Milestone milestone = milestoneRepository.findByIdAndUserId(milestoneId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found for this user"));

        milestone.setCompleted(!milestone.isCompleted());

        return milestoneRepository.save(milestone);
    }

    @Transactional
    public Challenge createChallenge(Challenge challenge, UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        challenge.setUser(user);

        challenge.setId(null);

        if (challenge.getMilestones() != null) {
            for (Milestone milestone : challenge.getMilestones()) {
                milestone.setChallenge(challenge);
                milestone.setCompleted(false); 
                milestone.setId(null);
            }
        }

        return challengeRepository.save(challenge);
    }

    @Transactional
    public void deleteChallenge(Long challengeId, UUID userId) {
        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!challenge.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("No permission to delete this challenge");
        }

        challengeRepository.delete(challenge);
    }

    @Transactional
    public Challenge updateChallenge(Challenge updatedChallenge, UUID userId) {
        Challenge existingChallenge = challengeRepository.findById(updatedChallenge.getId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge not found"));

        if (!existingChallenge.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("No permission to update this challenge");
        }

        existingChallenge.setTitle(updatedChallenge.getTitle());
        existingChallenge.setDescription(updatedChallenge.getDescription());
        existingChallenge.getMilestones().clear();
        if (updatedChallenge.getMilestones() != null) {
            for (Milestone milestone : updatedChallenge.getMilestones()) {
                milestone.setChallenge(existingChallenge);
                boolean status = milestone.isCompleted();
                milestone.setCompleted(status);
                if (milestone.getId() != null && milestone.getId() == 0) {
                    milestone.setId(null);
                }
                existingChallenge.getMilestones().add(milestone);
            }
        }

        return challengeRepository.save(existingChallenge);
    }
}