package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"strings"
)

// Define the response structure to unmarshal the json response
// from the Perspective API
type Response struct {
	AttributeScores   map[string]AttributeScores `json:"attributeScores"`
	Languages         []string                   `json:"languages"`
	DetectedLanguages []string                   `json:"detectedLanguages"`
}
type AttributeScores struct {
	SpanScores   []SpanScores `json:"spanScores"`
	SummaryScore Score        `json:"summaryScore"`
}
type SpanScores struct {
	Begin int   `json:"begin"`
	End   int   `json:"end"`
	Score Score `json:"score"`
}
type Score struct {
	Value float64 `json:"value"`
	Type  string  `json:"type"`
}

/**
 * Check if the message is toxic by calling the Perspective API
 * @param message The message to check
 * @return true if the message is toxic, false otherwise
 * @return error if the request failed
 */
func profanityCheck(message string) (bool, error) {
	//Get the response from the Perspective API
	rep, err := getApiReponse(message)
	if err != nil {
		return false, err
	}
	//Check if the message is toxic and retunr the result
	return verifyAnswer(rep), nil
}

/**
 * Analyse the response from the Perspective API
 * @param rep The response from the Perspective API
 * @return true if the message is toxic, false otherwise
 */
func verifyAnswer(rep Response) bool {
	var banMessage bool = false
	//Check if the message is toxic
	if rep.AttributeScores["TOXICITY"].SummaryScore.Value > 0.5 {
		banMessage = true
	}
	//Check if the message is an insult
	if rep.AttributeScores["INSULT"].SummaryScore.Value > 0.5 {
		banMessage = true
	}
	//Check if the message is a threat
	if rep.AttributeScores["THREAT"].SummaryScore.Value > 0.5 {
		banMessage = true
	}
	//Check if the message is a profanity
	/*if rep.AttributeScores["PROFANITY"].SummaryScore.Value > 0.5 {
		banMessage = true
	}*/
	return banMessage
}

/**
 * Call the Perspective API
 * @param message The message to check
 * @return Response The response from the Perspective API
 * @return error if the request failed
 */
func getApiReponse(message string) (Response, error) {
	var output Response

	//Create the body of the request with the messages and the field we want to check
	body := strings.NewReader(`{comment: {text: "` + message + `"},
	languages: ["en","fr"],
	requestedAttributes: {TOXICITY:{}, INSULT:{}, PROFANITY:{}, THREAT:{}} }`)
	//create the request
	req, err := http.NewRequest("POST", "https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=AIzaSyAi1W4OX4sA0rwSS3caitw1TkQ0_2wNE7A", body)
	if err != nil {
		return output, err
	}
	//Set the header of the request
	req.Header.Set("Content-Type", "application/json")
	//and send it
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return output, err
	}

	//Read the response
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return output, err
	}

	//Unmarshal the json response
	err = json.Unmarshal(data, &output)
	if err != nil {
		return output, err
	}

	//Close the response
	defer resp.Body.Close()

	//Return the response
	return output, nil
}
