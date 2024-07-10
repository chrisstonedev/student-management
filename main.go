package main

import (
	"database/sql"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"
	"log"
	"net/http"
	"strconv"
)

type student struct {
	ID    int    `json:"id"`
	Name  string `json:"name"`
	Grade int    `json:"grade"`
}

var db *sql.DB

func main() {
	connStr := "postgresql://localhost:5432/student_management?sslmode=disable"
	// Connect to database
	db1, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	db = db1

	router := gin.Default()
	router.Use(cors.Default())

	router.GET("/students", getStudents)
	router.POST("/students", postStudents)
	router.DELETE("/students/:id", deleteStudent)

	_ = router.Run("localhost:8080")
}

func getStudents(c *gin.Context) {
	var s student
	var students []student
	rows, err := db.Query(`SELECT * FROM students`)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Error reading from DB: %s", err)})
		return
	}
	defer rows.Close()
	for rows.Next() {
		err := rows.Scan(&s.ID, &s.Name, &s.Grade)
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Error scanning row: %s", err)})
		}
		students = append(students, s)
	}
	c.IndentedJSON(http.StatusOK, students)
}

func postStudents(c *gin.Context) {
	var newStudent student

	if err := c.BindJSON(&newStudent); err != nil {
		return
	}

	var lastInsertId int
	err := db.QueryRow("INSERT INTO students (name, grade) VALUES ($1, $2) RETURNING id", newStudent.Name, newStudent.Grade).Scan(&lastInsertId)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Error scanning row: %s", err)})
	}

	newStudent.ID = lastInsertId
	c.IndentedJSON(http.StatusCreated, newStudent)
}

func deleteStudent(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID is not an integer"})
		return
	}

	res, err := db.Exec("DELETE FROM students WHERE ID=$1", id)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Error scanning row: %s", err)})
	}
	count, err := res.RowsAffected()
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": fmt.Sprintf("Error checking for affected count: %s", err)})
	}
	if count == 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "ID does not match record in database, no rows deleted"})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "success"})
}
