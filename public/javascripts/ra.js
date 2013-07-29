$(function() {
	wsClient.doConnect('ws://dev.i:3125')

	$('.litb, .mini').click(function() {
		if ($(this).hasClass('active'))
			return false
		$('.litb.active, .mini.active').removeClass('active')
		$(this).addClass('active')
		return false
	})

	$('legend .inactive').focus(function() {
		$(this).removeClass('inactive')
	}).blur(function() {
		$(this).addClass('inactive')
	})

	$('#wizards').height( $('#initPanel').height() )

	$('.prevStep, .nextStep').click(function() {
		var thisPanel = $(this).parents('.wizardPanel'),
			targetPanel = $(this).hasClass('prevStep') ? thisPanel.prev() : thisPanel.next()
		if (targetPanel.length === 0)
			return false
		if (thisPanel.height() < targetPanel.height()) {
			$('#wizards').height( targetPanel.height() )
		}
		thisPanel.animate( {'left': $(this).hasClass('prevStep') ? '101%' : '-101%' })
		targetPanel.animate( {'left': 0} )

		return false
	})

	$('#saveTask').click(function() {
			var $this = $(this)
			var logPanel = $(this).parents('.wizardPanel').children('.log').length > 0
				? $(this).parents('.wizardPanel').children('.log').first()
				: $('<pre class="log"></pre>').appendTo( $(this).parents('.wizardPanel') )

			$('#wizards').height( $('#initPanel').height() )

			// Disable all buttons to prevent click by mistake
			$this.attr('disabled', true).siblings('.btn').attr('disabled', true)

			wsClient.doSend('save-task?' + $('form').serialize(), function(taskId) {
				if (taskId !== '0') {
					logPanel.scrollAppend('Task #' + taskId + ' inserted successfully!')
					$('#taskId').val(taskId)
				} else {
					logPanel.scrollAppend('Task #' + $('#taskId').val() + ' updated successfully!')
				}
				logPanel.scrollAppend('\n--------------------------------------\n')
				$('#taskName').attr('readonly', true)
				$('#codeVersion').attr('firmed-value', $('#codeVersion').val()).keyup(function() {
					if ($(this).val() !== $(this).attr('firmed-value')) {
						$('#saveTask').attr('disabled', false)
					}
				})
				$('#exportCode').attr('disabled', false)
			})

		return false
	})

	$('#exportCode').click(function() {
		if (confirm('确定要进行打包及同步代码的操作？')) {
			var $this = $(this)
			var logPanel = $(this).parents('.wizardPanel').children('.log').length > 0
				? $(this).parents('.wizardPanel').children('.log').first()
				: $('<pre class="log"></pre>').appendTo( $(this).parents('.wizardPanel') )

			$('#wizards').height( $('#initPanel').height() )

			// Disable all buttons to prevent click by mistake
			$this.attr('disabled', true).siblings('.btn').attr('disabled', true)

			wsClient.doSend('export-code?' + $('form').serialize(), function(msg) {
				logPanel.scrollAppend(msg)
				
				if (msg === 'Completed!!') {
					logPanel.scrollAppend('\n--------------------------------------\n')
					$this.attr('disabled', false).siblings('.nextStep').attr('disabled', false)
				}
			})
		}

		return false
	})
})

$.fn.scrollAppend = function(msg) {
	this.append(msg)
	this.scrollTop(this[0].scrollHeight)
}