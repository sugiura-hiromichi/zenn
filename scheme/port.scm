(import (scheme base) (scheme write) (scheme file) (scheme process-context) (scheme inexact))

(display "🫠")

(define (assert evaluator left right)
	(if (evaluator left right)
		#t
		((lambda ()
			(display "\n\n---\n\n")
			(display "# assertion failed\n\n   EVALUATOR:\t")
			(display evaluator)
			(display "\n   LEFT:\t\t")
			(display left)
			(display "\n   RIGHT:\t\t")
			(display right)))))

(assert eq? 1 1)

(define (cat)
	(let ((c (read-char)))
		(unless (eof-object? c)
			(display c)
			(cat))))

;(cat)

(define (cat_rl)
	(let ((buf (read-line)))
		(unless (eof-object? buf)
			(display buf)
			(newline)
			(cat_rl))))

;(cat_rl)

(define (cat_ln)
	(define (cat_lni n)
		(let ((buf (read-line)))
			(unless (eof-object? buf)
				(display buf)
				(newline)
				(cat_lni (+ n 1)))))
	(cat_lni 1))

;(cat_ln)

(define (cat2 filename)
	(define (cat2i port)
		(let ((c (read-char port)))
			(unless (eof-object? c)
				(display c)
				(cat2i port))))
	(call-with-input-file filename cat2i))

;(cat2 "port.scm")

(assert equal? (command-line) '("/Users/a/Downloads/QwQ/scheme/port.scm"))

(define (read_data)
	(define (read-num port)
		(define (readi rslt)
			(let ((c (read-char port)))
				(if (eof-object? c)
					rslt
					(readi (cons c rslt)))))))

(define (my_map f l)
	(if (null? l)
		'()
		(cons (f (car l)) (my_map f (cdr l)))))

(assert equal? (my_map (lambda (e) (* 2 e)) '(2 1 0)) '(4 2 0))

(define (remove-if pred l)
	(cond
		((null? l) '())
		((pred (car l)) (remove-if pred (cdr l)))
		(else (cons (car l) (remove-if pred (cdr l))))))

(assert equal? (remove-if odd? '(0 1 2 3 4)) '(0 2 4))
(assert equal? (remove-if even? '(0 1 2 3 4)) '(1 3))

(define (filter pred l)
	(cond
		((null? l) '())
		((pred (car l)) (cons (car l) (filter pred (cdr l))))
		(else (filter pred (cdr l)))))

(assert equal? (filter odd? '(0 1 2 3 4)) '(1 3))
(assert equal? (filter even? '(0 1 2 3 4)) '(0 2 4))

(define (foldl f g l)
	(if (null? l)
		g
		(foldl f (f g (car l)) (cdr l))))

(define (foldr f g l)
	(if (null? l)
		g
		(f (car l) (foldr f g (cdr l)))))

(assert eqv? (foldl * 1 '(2 3 4 5)) 120)
(assert eqv? (foldr * 1 '(2 3 4 5)) 120)
(assert equal? (foldr cons 0 '(1 2 3)) '(1 2 3 . 0))
(assert equal? (foldl cons 0 '(1 2 3)) '(((0 . 1) . 2) . 3))
(assert equal? (foldr cons '() '(0 1 2 3)) '(0 1 2 3))

; 畳み込みの応用
(define (my_length l)
	(foldl (lambda (x y) (+ x 1) 0 ls)))

(define (count_if pred l)
	(foldl
		(lambda (x y)
			(if (pred y)
				(+ x 1)
				x))
		0 l))

(define (my_map2 f l)
	(foldr
		(lambda (x y)
			(cons (f x) y))
		'() l))

(define (my_filter pred l)
	(foldr
		(lambda (x y)
			(if (pred x)
				(cons x y)
				y))
	'() l))

(define find
	(lambda (pred l)
		(cond
			((null? l) '())
			((pred (car l)) (car l))
			(else (find pred (cdr l))))))

(assert eqv? (find odd? '(6 6 6 1)) 1)

(define position
	(lambda (pred l)
		(define posi
			(lambda (pred l idx)
				(cond
					((null? l) '())
					((pred (car l)) idx)
					(else (posi pred (cdr l) (+ idx 1))))))
		(posi pred l 0)))

(assert eqv? (position odd? '(6 6 6 1)) 3)

(display "\n\n---\n🫠")
