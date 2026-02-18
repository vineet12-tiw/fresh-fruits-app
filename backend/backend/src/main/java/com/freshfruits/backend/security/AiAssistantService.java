package com.freshfruits.backend.security;


import com.freshfruits.backend.repository.OrderRepository;
import com.freshfruits.backend.service.RefundService;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel; // Using the low-level model
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Description;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.function.Function;

@Service
public class AiAssistantService {

    private final ChatModel chatModel;

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private RefundService refundService;

    public AiAssistantService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String chat(String userText) {
        // 1. Define the System Prompt (Personality)
        SystemMessage systemMsg = new SystemMessage("""
            You are the FreshFruits Support Agent.
            1. Use 'checkOrderStatus' if the user asks about an order.
            2. Use 'initiateRefund' if the user wants a refund (requires Order ID & Reason).
            3. STRICT: Refunds only allowed within 4 hours.
            """);

        UserMessage userMsg = new UserMessage(userText);

        // 2. Create the Prompt (NO OPTIONS NEEDED - handled by YML)
        Prompt prompt = new Prompt(List.of(systemMsg, userMsg));

        // 3. Call the Model
        ChatResponse response = chatModel.call(prompt);

        return response.getResult().getOutput().getText();
    }

    // =================================================================
    //  THE TOOLS (Enabled via application.properties)
    // =================================================================

    @Bean
    @Description("Check the status of an order given the Order ID")
    public Function<Long, String> checkOrderStatus() {
        return (orderId) -> orderRepository.findById(orderId)
                .map(order -> "Order #" + order.getId() + " is " + order.getStatus())
                .orElse("Order not found");
    }

    public record RefundRequest(Long orderId, String reason) {}

    @Bean
    @Description("Initiate a refund request.")
    public Function<RefundRequest, String> initiateRefund() {
        return (req) -> refundService.validateAndCreateTicket(req.orderId(), req.reason());
    }
}