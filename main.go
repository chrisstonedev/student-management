package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
)

type student struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Grade int    `json:"grade"`
}

var students = []student{
	{ID: 1, Name: "Alice Martin", Grade: 5},
	{ID: 2, Name: "Barbara Smith", Grade: 1},
	{ID: 3, Name: "Carl Jones", Grade: 3},
}

var maxId = 4

func main() {
	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/students", getStudents)
	router.GET("/students/:id", getStudentByID)
	router.POST("/students", postStudents)

	_ = router.Run("localhost:8080")
}

func getStudents(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, students)
}

func postStudents(c *gin.Context) {
	var newStudent student

	if err := c.BindJSON(&newStudent); err != nil {
		return
	}

	newStudent.ID = maxId
	maxId = maxId + 1

	students = append(students, newStudent)
	c.IndentedJSON(http.StatusCreated, newStudent)
}

func getStudentByID(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID is not an integer"})
		return
	}

	for _, s := range students {
		if s.ID == id {
			c.IndentedJSON(http.StatusOK, s)
			return
		}
	}
	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "student not found"})
}
